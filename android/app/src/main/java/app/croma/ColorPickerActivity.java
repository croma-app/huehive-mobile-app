package app.croma;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.ImageView;
import android.widget.Toast;

import com.facebook.common.internal.ByteStreams;
import com.google.android.gms.tasks.Task;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.ml.vision.FirebaseVision;
import com.google.firebase.ml.vision.common.FirebaseVisionImage;
import com.google.firebase.ml.vision.text.FirebaseVisionText;
import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

public class ColorPickerActivity extends AppCompatActivity {
    private static final int PICK_IMAGE = 1;
    private ImageView imageView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_color_picker);
        imageView = findViewById(R.id.imageView);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(view -> {
            Intent gallery = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.INTERNAL_CONTENT_URI);
            startActivityForResult(gallery, PICK_IMAGE);
        });
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE && resultCode == RESULT_OK) {
            Uri imageUri = data.getData();
            imageView.setImageURI(imageUri);
            try {
                FirebaseVisionImage image = FirebaseVisionImage.fromFilePath(ColorPickerActivity.this.getBaseContext(), imageUri);
                FirebaseVisionTextRecognizer detector = FirebaseVision.getInstance()
                        .getOnDeviceTextRecognizer();
                Task<FirebaseVisionText> result =
                    detector.processImage(image)
                        .addOnSuccessListener(firebaseVisionText -> {
                            // Task completed successfully
                            // ...
                            String resultText = firebaseVisionText.getText();
                            Toast.makeText(ColorPickerActivity.this, "Result text:" + resultText, Toast.LENGTH_LONG).show();
                        })
                        .addOnFailureListener(e -> {
                                // Task failed with an exception
                                // ...
                                Toast.makeText(ColorPickerActivity.this, "Failed:" + e.getMessage(), Toast.LENGTH_LONG).show();
                            });
                //Toast.makeText(ColorPickerActivity.this.getBaseContext(), result.getResult().getText(), Toast.LENGTH_LONG);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } // TODO: handle case when canceled
    }

}
