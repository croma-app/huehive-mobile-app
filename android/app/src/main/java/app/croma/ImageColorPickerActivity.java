package app.croma;

import static app.croma.DrawTouchDot.getColorView;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import androidx.appcompat.app.AppCompatActivity;

public class ImageColorPickerActivity extends AppCompatActivity {

  @SuppressLint({"SourceLockedOrientationActivity"})
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Intent intent = getIntent();
    String uri = intent.getExtras().getString("uri");
    setContentView(R.layout.activity_image_color_picker);
    ImageView imageView = findViewById(R.id.main_image_view);
    imageView.setImageURI(Uri.parse(uri));
    setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    ImageButton doneButton = findViewById(R.id.done_button);
    final Bitmap bitmap = ((BitmapDrawable) imageView.getDrawable()).getBitmap();
    RelativeLayout imageDisplayArea = this.findViewById(R.id.image_display_area);
    imageView.setOnTouchListener((v, event) -> {
          int left = v.getLeft();
          int top = v.getTop();
          int x = (int) event.getX();
          int y = (int) event.getY();
          int pixel = bitmap.getPixel(x, y);
          View vc = getColorView(ImageColorPickerActivity.this, x + left, y + top, pixel);
          imageDisplayArea.addView(vc);
          // then do what you want with the pixel data, e.g
          System.out.println("pixel value:" + pixel);
          return false;
        });
  }

  @Override
  protected void onPostCreate(Bundle savedInstanceState) {
    super.onPostCreate(savedInstanceState);
  }
}
