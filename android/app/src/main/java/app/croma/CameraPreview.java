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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashSet;
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

        colors = new HashSet<Integer>();

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

            mCamera.setPreviewCallback(new Camera.PreviewCallback() {

                @Override
                public void onPreviewFrame(byte[] bytes, Camera camera) {
                    camera.setPreviewCallback(null);

                    Bitmap bitmap = getBitmap(bytes, camera);
                    bitmap = rotate(bitmap, 90);

                    bitmap = Bitmap.createScaledBitmap(bitmap, view.getWidth(), view.getHeight(), true);

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
                    vc.setOnClickListener(new OnClickListener() {
                        @Override
                        public void onClick(View view) {

                        }
                    });

                    colors.add(color);

                    cameraPreview.addView(vc);
                }
            });
        }

        return false;
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
        r.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                return false;
            }
        });

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