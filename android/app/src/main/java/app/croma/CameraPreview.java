package app.croma;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ImageFormat;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.graphics.YuvImage;
import android.graphics.drawable.Drawable;
import android.hardware.Camera;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.flexbox.AlignContent;
import com.google.android.flexbox.AlignItems;
import com.google.android.flexbox.FlexWrap;
import com.google.android.flexbox.FlexboxLayout;
import com.google.android.flexbox.JustifyContent;
import com.google.android.gms.tasks.Task;
import com.google.firebase.ml.vision.FirebaseVision;
import com.google.firebase.ml.vision.common.FirebaseVisionImage;
import com.google.firebase.ml.vision.text.FirebaseVisionText;
import com.google.firebase.ml.vision.text.FirebaseVisionText.TextBlock;
import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import top.defaults.drawabletoolbox.DrawableBuilder;

public class CameraPreview extends SurfaceView implements SurfaceHolder.Callback,View.OnTouchListener {
    private SurfaceHolder mHolder;
    private Camera mCamera;
    private RelativeLayout cameraPreview;
    private Set<Integer> colors;
    private Timer timer;
    public CameraPreview(Activity activity, Camera cameraObj, RelativeLayout cameraPreview) {
        super(activity);
        mCamera = cameraObj;
        this.cameraPreview = cameraPreview;
        colors = new HashSet<>();
        mHolder = getHolder();
        mHolder.addCallback(this);
        timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask(){
            public void run(){
                synchronized (this) {
                    mCamera.setPreviewCallback(((bytes, camera) -> {
                        mCamera.setPreviewCallback(null);
                        Bitmap bitmap = getBitmap(bytes, camera);
                        recogniseAndDrawColors(bitmap);
                    }));
                }
            }
        },3000,5000);

    }

    public Set<Integer> getColors() {
        return colors;
    }

    public void surfaceCreated(SurfaceHolder holder) {
        // The Surface has been created, now tell the camera where to draw the preview.
        try {
            mCamera.setPreviewDisplay(holder);
            mCamera.startPreview();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void surfaceDestroyed(SurfaceHolder holder) {
        // Do nothing
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) {
        // No need to change preview, using orientation portrait
    }

    @Override
    public boolean onTouch(final View view, final MotionEvent motionEvent) {
        if (motionEvent.getAction() == MotionEvent.ACTION_DOWN) {
            return true;
        } else if (motionEvent.getAction() == MotionEvent.ACTION_UP) {
            final int x = (int) motionEvent.getX();
            final int y = (int) motionEvent.getY();
            synchronized (this) {
                mCamera.setPreviewCallback((bytes, camera) -> {
                    camera.setPreviewCallback(null);
                    Bitmap bitmap = getBitmap(bytes, camera);
                    Bitmap mutableBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                    int color = mutableBitmap.getPixel(x, y);
                    Paint paint = new Paint();
                    paint.setAntiAlias(true);
                    paint.setColor(Color.RED);
                    Bitmap cpBitmap = Bitmap.createBitmap(cameraPreview.getWidth(),
                            cameraPreview.getHeight(), Bitmap.Config.ARGB_8888);
                    Canvas cc = new Canvas(cpBitmap);
                    Canvas canvas = new Canvas(mutableBitmap);
                    canvas.drawCircle(x, y, 5, paint);
                    cc.drawCircle(x, y, 5, paint);
                    cameraPreview.draw(cc);
                    View vc = getColorView(getContext(), x, y, color);
                    colors.add(color);
                    cameraPreview.addView(vc);

                });
            }
        }

        return false;
    }

    private void recogniseAndDrawColors(Bitmap bitmap) {
        FirebaseVisionImage image = FirebaseVisionImage.fromBitmap(bitmap);
        FirebaseVisionTextRecognizer detector = FirebaseVision.getInstance()
                .getOnDeviceTextRecognizer();
        Task<FirebaseVisionText> result = detector.processImage(image)
        .addOnSuccessListener(firebaseVisionText -> {
            String resultText = firebaseVisionText.getText();
            List<TextBlock> textBlocks = firebaseVisionText.getTextBlocks();
            for (TextBlock textBlock : textBlocks) {
                List<String> colors = Colors.parse(textBlock.getText());
                List<String> newColors = new ArrayList<>();
                for (String color : colors) {
                    int intColor = Color.parseColor(color);
                    if (!this.colors.contains(intColor)) {
                        this.colors.add(intColor);
                        newColors.add(color);
                    }
                }
                if (!newColors.isEmpty()) {
                    Rect rect = textBlock.getBoundingBox();
                    cameraPreview.addView(getColorTextView(getContext(),
                            rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top, newColors));
                    Toast.makeText(getContext(), newColors.size() + " new colors recognized.", Toast.LENGTH_LONG).show();
                }

            }

        })
        .addOnFailureListener(e -> {
            Toast.makeText(getContext(), "Failed:" + e.getMessage(), Toast.LENGTH_LONG).show();
        });
    }

    private View getColorView(Context ct, int x, int y, int color) {
        int radius = (int) (16 * getResources().getDisplayMetrics().density + 0.5f);
        RelativeLayout.LayoutParams params;
        params = new RelativeLayout.LayoutParams(radius * 2, radius * 2);
        params.leftMargin = x - radius;
        params.topMargin = y - radius;
        RelativeLayout r = new RelativeLayout(ct);
        r.setLayoutParams(params);
        DrawTouchDot dc = new DrawTouchDot(ct, color, radius);
        r.addView(dc);
        r.setOnTouchListener((view, motionEvent) -> false);
        return r;
    }


    private View getColorTextView(Context ct, int left, int top, int w, int h, List<String> colors) {
        RelativeLayout.LayoutParams params;
        w = Math.max(dp(150), w);
        h = Math.max(dp(60), h);
        params = new RelativeLayout.LayoutParams(w, h);
        FlexboxLayout flexboxLayout = new FlexboxLayout(ct);
        flexboxLayout.setFlexWrap(FlexWrap.WRAP);
        flexboxLayout.setAlignContent(AlignContent.FLEX_START);
        flexboxLayout.setAlignItems(AlignItems.CENTER);
        flexboxLayout.setJustifyContent(JustifyContent.SPACE_AROUND);
        flexboxLayout.setBackgroundColor(Color.argb(100, 100, 100, 100));
        flexboxLayout.setLayoutParams(params);
        params.leftMargin = left;
        params.topMargin = top;

      for (String color : colors) {
          int intColor = Color.parseColor(color);
          TextView textView = new TextView(getContext());
          textView.setText(color);
          textView.setTextSize(dp(8));

          textView.setPadding(dp(8), dp(8), dp(8), dp(8));
          textView.setTypeface(null, Typeface.BOLD);
          textView.setTextColor(isColorDark(intColor) ? Color.WHITE : Color.BLACK);
          textView.setBackgroundColor(intColor);
          Drawable sd =  new DrawableBuilder()
                  .rectangle()
                  .solidColor(intColor).strokeColor(Color.WHITE).strokeWidth(dp(4))
                  .cornerRadii(dp(20), dp(20), dp(20), dp(20))
                  .build();
          textView.setBackground(sd);
          flexboxLayout.addView(textView);
          System.out.println("Width: " + textView.getWidth() + "," + textView.getHeight());
      }
        flexboxLayout.setOnTouchListener((view, motionEvent) -> false);

        return flexboxLayout;
    }

    public boolean isColorDark(int color){
        double darkness = 1-(0.299*Color.red(color) + 0.587*Color.green(color) + 0.114*Color.blue(color))/255;
        if(darkness < 0.5){
            return false; // It's a light color
        }else{
            return true; // It's a dark color
        }
    }

    private int dp(int px) {
        final float scale = getContext().getResources().getDisplayMetrics().density;
        return (int) (px * scale * .5f);
        //int height = (int) (60 * scale + 0.5f);
    }

    private Bitmap rotate(Bitmap b) {
        Matrix matrix = new Matrix();
        matrix.postRotate(90);

        Bitmap rotatedBitmap = Bitmap.createBitmap(b , 0, 0, b.getWidth(), b.getHeight(), matrix, true);

        return rotatedBitmap;
    }

    private Bitmap getBitmap(byte data[], Camera camera) {
        // Convert to JPG
        Camera.Size previewSize = camera.getParameters().getPreviewSize();
        YuvImage yuvimage=new YuvImage(data, ImageFormat.NV21, previewSize.width, previewSize.height, null);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        yuvimage.compressToJpeg(new Rect(0, 0, previewSize.width, previewSize.height), 80, baos);

        byte[] jdata = baos.toByteArray();

        // Convert to Bitmap
        Bitmap bitmap = BitmapFactory.decodeByteArray(jdata, 0, jdata.length);
        bitmap = rotate(bitmap);
        bitmap = Bitmap.createScaledBitmap(bitmap, this.getWidth(), this.getHeight(), true);
        return bitmap;
    }

    public void onStop() {
        timer.cancel();
    }
}