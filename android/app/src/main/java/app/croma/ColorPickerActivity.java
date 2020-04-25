package app.croma;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.hardware.Camera;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.Toast;


import java.util.ArrayList;
import java.util.List;
import java.util.Set;


public class ColorPickerActivity extends Activity {
    private Camera mCamera;
    private CameraPreview mPreview;
    private ImageButton doneButton;
    private RotateView orientation;
    private HelpAnimator helpAnimator;

    private final static int NO_COLOR_HELP_TIMEOUT = 1000;

    @Override
    protected void onStart() {
        super.onStart();

        setContentView(R.layout.picker);
        setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        if (!Utils.checkCameraHardware(this)) {
            Toast.makeText(this, "Camera is not available", Toast.LENGTH_LONG).show();
            this.finish();
            return;
        }
        doneButton = findViewById(R.id.done_button);
        orientation = new RotateView(this, doneButton);

        final View noColorHelp = ColorPickerActivity.this.findViewById(R.id.no_color_help);

        helpAnimator = new HelpAnimator(noColorHelp);

        if (orientation.canDetectOrientation()) {
            orientation.enable();
        }

        // Create an instance of Camera
        mCamera = getCameraInstance();

        if (mCamera == null) {
            Toast.makeText(this, "No camera is available ", Toast.LENGTH_LONG).show();
            this.finish();
            return;
        }

        // Get Camera parameters
        Camera.Parameters params = mCamera.getParameters();

        List<String> focusModes = params.getSupportedFocusModes();

        if (focusModes.contains(Camera.Parameters.FOCUS_MODE_AUTO)) {
            params.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO); // Autofocus mode supported
        }

        // Set Camera parameters
        mCamera.setParameters(params);
        mCamera.setDisplayOrientation(90);

        // Create our Preview view and set it as the content of our activity.
        RelativeLayout rl = this.findViewById(R.id.camera_preview);
        mPreview = new CameraPreview(this, mCamera, rl);

        RelativeLayout preview = findViewById(R.id.camera_preview);
        preview.setOnTouchListener(mPreview);
        preview.addView(mPreview);

        noColorHelp.bringToFront();
        noColorHelp.setVisibility(View.INVISIBLE);

        doneButton.setOnClickListener(view -> {
            if (mPreview.getColors().size() != 0) {
                Set<Integer> set = mPreview.getColors();
                Intent intent = new Intent();
                ArrayList<Integer> al = new ArrayList<>(set.size());

                for (int c : set) {
                    al.add(c);
                }

                intent.putIntegerArrayListExtra("colors", al);
                setResult(RESULT_OK, intent);
                finish();
            } else {
                AlphaAnimation anim = new AlphaAnimation(0.0f, 1.0f);
                anim.setDuration(ColorPickerActivity.NO_COLOR_HELP_TIMEOUT);

                anim.setRepeatCount(1);

                anim.setRepeatMode(Animation.REVERSE);
                anim.setAnimationListener(helpAnimator);
                noColorHelp.startAnimation(anim);
            }
        });
    }


    @Override
    public void onPause() {
        super.onPause();

        if (orientation != null) {
            orientation.disable();
        }

        mCamera.release();
    }

    // Safely way get an instance of the Camera object.
    private Camera getCameraInstance(){
        Camera c = null;
        int[] cameras = {Camera.CameraInfo.CAMERA_FACING_FRONT, 0};

        try {
            c = Camera.open(); // Attempt to get a Camera instance
        } catch (Exception e){
            // Camera is not available (in use or does not exist)
            e.printStackTrace();
        }

        for (int i = 0;i < cameras.length;i++) {
            if (c == null) {
                try {
                    c = Camera.open(cameras[i]); // Try to open camera
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        return c; // Returns null if camera is unavailable
    }

}
