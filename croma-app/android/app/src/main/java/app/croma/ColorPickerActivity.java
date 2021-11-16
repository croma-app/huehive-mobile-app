package app.croma;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.hardware.Camera;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.Toast;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.jetbrains.annotations.NotNull;

public class ColorPickerActivity extends Activity {

  private static final int MY_CAMERA_REQUEST_CODE = 1;
  private static final String COLOR_PICKER_HELP_COUNT = "color_picker_help_count";
  private static final int HELP_MSG_MAX_COUNT = 3;
  private Camera mCamera;
  private CameraPreview mPreview;
  private ImageButton doneButton;
  private RotateView orientation;
  private HelpAnimator helpAnimator;

  private static final int NO_COLOR_HELP_TIMEOUT = 2500;

  @Override
  public void onRequestPermissionsResult(
      int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == MY_CAMERA_REQUEST_CODE) {
      if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        Toast.makeText(this, "camera permission granted", Toast.LENGTH_LONG).show();
        start();
      } else {
        Toast.makeText(
                this,
                "camera permission denied. This feature can not work without camera permission",
                Toast.LENGTH_LONG)
            .show();
      }
    }
  }

  @Override
  protected void onStart() {
    super.onStart();
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
        == PackageManager.PERMISSION_DENIED) {
      ActivityCompat.requestPermissions(
          this, new String[] {Manifest.permission.CAMERA}, MY_CAMERA_REQUEST_CODE);
    } else {
      start();
    }
  }

  @SuppressLint("SourceLockedOrientationActivity")
  private void start() {
    setContentView(R.layout.picker);
    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

    if (!Utils.checkCameraHardware(this)) {
      Toast.makeText(this, "Camera is not available", Toast.LENGTH_LONG).show();
      this.finish();
      return;
    }
    doneButton = findViewById(R.id.done_button);
    orientation = new RotateView(this, doneButton);

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
    if (focusModes.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE)) {
      params.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
    } else if (focusModes.contains(Camera.Parameters.FOCUS_MODE_AUTO)) {
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
    final View showHelpView = this.findViewById(R.id.help_msg);
    handleHelpMsg(showHelpView);
    doneButton.setOnClickListener(
        view -> {
          if (mPreview.getColors().size() != 0) {
            Set<Integer> set = mPreview.getColors();
            Intent intent = new Intent();
            intent.putIntegerArrayListExtra("colors", new ArrayList<>(set));
            setResult(RESULT_OK, intent);
            finish();
          } else {
            AlphaAnimation anim = new AlphaAnimation(0.0f, 1.0f);
            anim.setDuration(ColorPickerActivity.NO_COLOR_HELP_TIMEOUT);
            anim.setRepeatCount(1);
            anim.setRepeatMode(Animation.REVERSE);
            anim.setAnimationListener(helpAnimator);
            showHelpView.startAnimation(anim);
          }
        });
  }

  @NotNull
  private View handleHelpMsg(View showHelpView) {
    helpAnimator = new HelpAnimator(showHelpView);
    showHelpView.bringToFront();
    showHelpView.setVisibility(View.INVISIBLE);
    if (colorPickerMsgCount() < HELP_MSG_MAX_COUNT) {
      showHelp(showHelpView);
    }
    return showHelpView;
  }

  private void showHelp(View showHelpView) {
    AlphaAnimation anim = new AlphaAnimation(0.0f, 1.0f);
    anim.setDuration(ColorPickerActivity.NO_COLOR_HELP_TIMEOUT);
    anim.setRepeatCount(1);
    anim.setRepeatMode(Animation.REVERSE);
    anim.setAnimationListener(helpAnimator);
    anim.setStartOffset(800);
    showHelpView.startAnimation(anim);
    incColorPickerMsgCount();
  }

  private SharedPreferences getSharedPreferences() {
    return getSharedPreferences(
        SharedPreferencesConstants.COLOR_PICKER_ACTIVITY, Context.MODE_PRIVATE);
  }

  private void incColorPickerMsgCount() {
    SharedPreferences sharedpreferences = getSharedPreferences();
    Editor editor = sharedpreferences.edit();
    editor.putInt(COLOR_PICKER_HELP_COUNT, colorPickerMsgCount() + 1);
    editor.commit();
  }

  private int colorPickerMsgCount() {
    SharedPreferences sharedPreferences = getSharedPreferences();
    return sharedPreferences.getInt(COLOR_PICKER_HELP_COUNT, 0);
  }

  @Override
  public void onPause() {
    super.onPause();
    if (mPreview != null) {
      mPreview.onStop();
    }
    if (orientation != null) {
      orientation.disable();
    }
    if (mCamera != null) {
      mCamera.release();
    }
  }

  @Override
  public void onStop() {
    super.onStop();
  }

  // Safely way get an instance of the Camera object.
  private Camera getCameraInstance() {
    Camera c = null;
    int[] cameras = {Camera.CameraInfo.CAMERA_FACING_FRONT, 0};

    try {
      c = Camera.open(); // Attempt to get a Camera instance
    } catch (Exception e) {
      // Camera is not available (in use or does not exist)
      e.printStackTrace();
    }

    for (int i = 0; i < cameras.length; i++) {
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
