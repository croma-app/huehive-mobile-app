package app.croma;

import static app.croma.DrawTouchDot.getColorView;
import static app.croma.FirebaseAnalyticsConstants.IMAGE_COLOR_PICKER_DONE;
import static app.croma.FirebaseAnalyticsConstants.IMAGE_COLOR_PICKER_TOUCH_TO_GET_COLOR;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
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

  @SuppressLint({"SourceLockedOrientationActivity"})
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    firebaseAnalytics = FirebaseAnalytics.getInstance(this);
    colors = new HashSet<>();
    String uri = getIntent().getExtras().getString("uri");
    setContentView(R.layout.activity_image_color_picker);
    ImageView imageView = findViewById(R.id.main_image_view);
    imageView.setImageURI(Uri.parse(uri));
    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    ImageButton doneButton = findViewById(R.id.done_button);
    doneButton.setOnClickListener(
        view -> {
          Intent intent = new Intent();
          intent.putIntegerArrayListExtra("colors", new ArrayList<>(colors));
          setResult(RESULT_OK, intent);
          firebaseAnalytics.logEvent(IMAGE_COLOR_PICKER_DONE, new Bundle());
          finish();
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

  @Override
  protected void onPostCreate(Bundle savedInstanceState) {
    super.onPostCreate(savedInstanceState);
  }
}
