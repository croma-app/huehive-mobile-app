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
import android.graphics.YuvImage;
import android.hardware.Camera;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.Task;
import com.google.firebase.ml.vision.FirebaseVision;
import com.google.firebase.ml.vision.common.FirebaseVisionImage;
import com.google.firebase.ml.vision.text.FirebaseVisionText;
import com.google.firebase.ml.vision.text.FirebaseVisionText.TextBlock;
import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CameraPreview extends SurfaceView implements SurfaceHolder.Callback,View.OnTouchListener {
    private SurfaceHolder mHolder;
    private Camera mCamera;
    private RelativeLayout cameraPreview;
    private Set<Integer> colors;
    public CameraPreview(Activity activity, Camera camera, RelativeLayout cameraPreview) {
        super(activity);
        mCamera = camera;
        this.cameraPreview = cameraPreview;/*(RelativeLayout) activity.findViewById(R.id.camera_preview);*/
        colors = new HashSet<>();
        mHolder = getHolder();
        mHolder.addCallback(this);
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
            mCamera.setPreviewCallback((bytes, camera) -> {
                camera.setPreviewCallback(null);
                Bitmap bitmap = getBitmap(bytes, camera);
                bitmap = rotate(bitmap, 90);
                bitmap = Bitmap.createScaledBitmap(bitmap, view.getWidth(), view.getHeight(), true);
                recogniseAndDrawColors(bitmap);
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
                List<String> colors = extractColors(textBlock.getText());
                int i = 0;
                for (String color : colors) {
                    cameraPreview.addView(getColorTextView(getContext(),
                            textBlock.getBoundingBox().left, textBlock.getBoundingBox().top + i * 60, color));
                    i++;
                }
            }
            //cameraPreview.addView(getColorTextView(getContext(), x, y, String.format("#%06X", (0xFFFFFF & color))));
            Toast.makeText(getContext(), "Result text:" + resultText, Toast.LENGTH_LONG).show();
        })
        .addOnFailureListener(e -> {
            Toast.makeText(getContext(), "Failed:" + e.getMessage(), Toast.LENGTH_LONG).show();
        });
    }
    private List<String> extractColors(String text) {
        return Arrays.asList("#abcc12", "#fffaaa");
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


    private View getColorTextView(Context ct, int left, int top, String color) {
        RelativeLayout.LayoutParams params;
        final float scale = getContext().getResources().getDisplayMetrics().density;
        int height = (int) (60 * scale + 0.5f);
        params = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.WRAP_CONTENT,
                height);

        params.leftMargin = left;
        params.topMargin = top;

        RelativeLayout r = new RelativeLayout(ct);

        r.setLayoutParams(params);

        TextView textView = new TextView(getContext());
        textView.setText(color);
        textView.setBackgroundColor(Color.parseColor(color));

        r.addView(textView);
        r.setOnTouchListener((view, motionEvent) -> false);

        return r;
    }

    private Bitmap rotate(Bitmap b, int a) {
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
        Bitmap bmp = BitmapFactory.decodeByteArray(jdata, 0, jdata.length);

        return bmp;
    }
}