package app.croma;

import static app.croma.DrawTouchDot.getColorView;
import static app.croma.FirebaseAnalyticsConstants.IMAGE_COLOR_PICKER_DONE;
import static app.croma.FirebaseAnalyticsConstants.IMAGE_COLOR_PICKER_TOUCH_TO_GET_COLOR;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.analytics.FirebaseAnalytics;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class ImageColorPickerActivity extends AppCompatActivity {
  private Set<Integer> colors;
  private FirebaseAnalytics firebaseAnalytics;
  private HelpAnimator helpAnimator;
  private static final String COLOR_PICKER_HELP_COUNT = "color_picker_help_count";
  private static final int HELP_MSG_MAX_COUNT = 2;

  @SuppressLint({"SourceLockedOrientationActivity"})
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    firebaseAnalytics = FirebaseAnalytics.getInstance(this);
    colors = new HashSet<>();
    String uri = getIntent().getExtras().getString("uri");
    setContentView(R.layout.activity_image_color_picker);
    final View showHelpView = this.findViewById(R.id.help_msg);
    handleHelpMsg(showHelpView);
    ImageView imageView = findViewById(R.id.main_image_view);
    imageView.setImageURI(Uri.parse(uri));
    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    ImageButton doneButton = findViewById(R.id.done_button);
    doneButton.setOnClickListener(
        view -> {
          if (colors.isEmpty()) {
            showHelp(showHelpView);
          } else {
            Intent intent = new Intent();
            intent.putIntegerArrayListExtra("colors", new ArrayList<>(colors));
            setResult(RESULT_OK, intent);
            firebaseAnalytics.logEvent(IMAGE_COLOR_PICKER_DONE, new Bundle());
            finish();
          }
        });
    final Bitmap bitmap[] = {null};
    RelativeLayout imageDisplayArea = this.findViewById(R.id.image_display_area);
    imageView.post(
        () ->
            bitmap[0] =
                Bitmap.createScaledBitmap(
                    ((BitmapDrawable) imageView.getDrawable()).getBitmap(),
                    imageView.getWidth(),
                    imageView.getHeight(),
                    true));
    imageView.setOnTouchListener(
        (v, event) -> {
          if (event.getAction() == MotionEvent.ACTION_UP) {
            int left = v.getLeft();
            int top = v.getTop();
            int x = (int) event.getX();
            int y = (int) event.getY();
            int pixel = bitmap[0].getPixel(x, y);
            colors.add(pixel);
            View vc = getColorView(ImageColorPickerActivity.this, x + left, y + top, pixel);
            imageDisplayArea.addView(vc);
            firebaseAnalytics.logEvent(IMAGE_COLOR_PICKER_TOUCH_TO_GET_COLOR, new Bundle());
            return false;
          } else {
            return true;
          }
        });
  }

  private void handleHelpMsg(View showHelpView) {
    helpAnimator = new HelpAnimator(showHelpView);
    showHelpView.bringToFront();
    showHelpView.setVisibility(View.INVISIBLE);
    if (colorPickerMsgCount() < HELP_MSG_MAX_COUNT) {
      showHelp(showHelpView);
    }
  }

  private void showHelp(View showHelpView) {
    AlphaAnimation anim = new AlphaAnimation(0.0f, 1.0f);
    anim.setDuration(2500);
    anim.setRepeatCount(1);
    anim.setRepeatMode(Animation.REVERSE);
    anim.setAnimationListener(helpAnimator);
    anim.setStartOffset(800);
    showHelpView.startAnimation(anim);
    incColorPickerMsgCount();
  }

  private SharedPreferences getSharedPreferences() {
    return getSharedPreferences(
        SharedPreferencesConstants.IMAGE_COLOR_PICKER_ACTIVITY, Context.MODE_PRIVATE);
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
  protected void onPostCreate(Bundle savedInstanceState) {
    super.onPostCreate(savedInstanceState);
  }
}
