package app.croma;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ImageView;
import androidx.appcompat.app.AppCompatActivity;

public class ImageColorPickerActivity extends AppCompatActivity {

  private final Handler mHideHandler = new Handler();
  private View mContentView;

  private View mControlsView;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Intent intent = getIntent();
    String uri = intent.getExtras().getString("uri");
    setContentView(R.layout.activity_image_color_picker);
    ImageView imageView = findViewById(R.id.main_image_view);
    imageView.setImageURI(Uri.parse(uri));
    mControlsView = findViewById(R.id.fullscreen_content_controls);

    // Set up the user interaction to manually show or hide the system UI.
    imageView.setOnClickListener(
        new View.OnClickListener() {
          @Override
          public void onClick(View view) {}
        });
  }

  @Override
  protected void onPostCreate(Bundle savedInstanceState) {
    super.onPostCreate(savedInstanceState);
  }
}
