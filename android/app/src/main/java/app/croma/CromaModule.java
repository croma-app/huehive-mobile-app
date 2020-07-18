package app.croma;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.firebase.analytics.FirebaseAnalytics;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.numixproject.colorextractor.image.Color;
import org.numixproject.colorextractor.image.Image;
import org.numixproject.colorextractor.image.KMeansColorPicker;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static app.croma.FirebaseAnalyticsConstants.TIME_TAKEN_TO_PROCESS_MS;

public class CromaModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int PICK_COLORS = 1;
    private final ReactApplicationContext reactContext;
    private Callback callback;
    private FirebaseAnalytics mFirebaseAnalytics;
    public CromaModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
        mFirebaseAnalytics = FirebaseAnalytics.getInstance(reactContext);
    }

    @Override
    public String getName() {
        return "CromaModule";
    }

    @ReactMethod
    public void navigateToColorPicker(Callback callback) {
        this.callback = callback;
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, ColorPickerActivity.class);
        context.startActivityForResult(intent, PICK_COLORS, new Bundle());
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (data != null && requestCode == PICK_COLORS) {
            try {
                this.callback.invoke(mapToJsonString(data.getIntegerArrayListExtra("colors")));
            } catch (JSONException e) {
                throw new IllegalStateException(e);
            }
        }
    }

    private String mapToJsonString(List<Integer> colors) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        List<JSONObject> colorsObjs = new ArrayList<>();
        for (int color : colors) {
            colorsObjs.add(new JSONObject().put("color", String.format("#%06X", (0xFFFFFF & color)).toLowerCase()));
        }
        jsonObject.put("colors", new JSONArray(colorsObjs));
        return jsonObject.toString();
    }

    private String toJson(int arr[][]) throws JSONException {

        // loop through your elements
        List<JSONArray> list = new ArrayList<>(arr.length);
        for (int i=0; i < arr.length; i++){
            list.add(new JSONArray(arr[i]));
        }
        JSONArray parentJsonArray = new JSONArray(list);
        return parentJsonArray.toString();
    }

    @Override
    public void onNewIntent(Intent intent) {

    }


    @ReactMethod
    public void pickTopColorsFromImage(String uri, Callback callback) {
        try {
            long startTime = System.currentTimeMillis();
            Uri imageUri = Uri.parse(uri);
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(reactContext.getContentResolver(), imageUri);
            Image image = new BitmapImage(bitmap);
            KMeansColorPicker k = new KMeansColorPicker();
            List<Color> colors = k.getUsefulColors(image, 6);
            List<Integer> intColors = new ArrayList<>();
            for (Color color : colors) {
                intColors.add(color.getRGB());
            }
            Bundle params = new Bundle();
            params.putLong(TIME_TAKEN_TO_PROCESS_MS, (System.currentTimeMillis() - startTime));
            mFirebaseAnalytics.logEvent(FirebaseAnalyticsConstants.PICK_COLORS_FROM_IMAGE, params);
            callback.invoke(null, mapToJsonString(intColors));
        } catch (Exception e) {
            e.printStackTrace();
            callback.invoke(e);
        }
    }

    @ReactMethod
    public void getBitmap(String uri, int width, int height, Callback callback) {
        try {
            long startTime = System.currentTimeMillis();
            Uri imageUri = Uri.parse(uri);
            Bitmap bitmap = MediaStore.Images.Media.getBitmap(reactContext.getContentResolver(), imageUri);
            BitmapImage image = new BitmapImage(bitmap);
            image = image.getScaledInstance(width, height);
            image = new BitmapImage(rotateImageToCorrectOrientation(image.getImage(), imageUri.getPath()));
            int imageMatrix[][] = new int[image.getWidth()][image.getHeight()];
            for (int i = 0;i < image.getWidth(); i++) {
                for (int j = 0;j < image.getHeight(); j++) {
                    imageMatrix[i][j] = image.getColor(i, j).getRGB();
                }
            }
            // TODO: find a efficient way to send it back.
            String resultJson = toJson(imageMatrix);
            Bundle params = new Bundle();
            params.putLong(TIME_TAKEN_TO_PROCESS_MS, (System.currentTimeMillis() - startTime));
            mFirebaseAnalytics.logEvent(FirebaseAnalyticsConstants.GET_BITMAP, params);
            callback.invoke(null, resultJson);
        } catch (Exception e) {
            e.printStackTrace();
            callback.invoke(e);
        }
    }
    @ReactMethod
    public void logEvent(String eventId, String data) {
        //https://firebase.google.com/docs/analytics/events?platform=android
        System.out.println("EventId: " + eventId + "," + data);
        Bundle params = new Bundle();
        params.putString("data", data);
        mFirebaseAnalytics.logEvent(eventId, params);
    }

    private static class BitmapImage extends Image {
        private Bitmap image;

        public BitmapImage(Bitmap b) {
            super(b.getWidth(), b.getHeight());
            this.image = b;
        }
        @Override
        public Color getColor(int x, int y) {
            return new Color(image.getPixel(x, y));
        }

        public Bitmap getImage() {
            return image;
        }
        @Override
        public BitmapImage getScaledInstance(int width, int height) {
            Bitmap resized = Bitmap.createScaledBitmap(this.image, width, height, true);
            return new BitmapImage(resized);
        }
    }

    public  Bitmap rotateImageToCorrectOrientation(Bitmap bitmap, String path) throws IOException {
        int rotate = 0;
        ExifInterface exif;
        exif = new ExifInterface(path);
        int orientation = exif.getAttributeInt(ExifInterface.TAG_ORIENTATION,
                ExifInterface.ORIENTATION_NORMAL);
        Matrix matrix = new Matrix();
        switch (orientation) {
            case ExifInterface.ORIENTATION_NORMAL:
                return bitmap;
            case ExifInterface.ORIENTATION_FLIP_HORIZONTAL:
                matrix.setScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_ROTATE_180:
                matrix.setRotate(180);
                break;
            case ExifInterface.ORIENTATION_FLIP_VERTICAL:
                matrix.setRotate(180);
                matrix.postScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_TRANSPOSE:
                matrix.setRotate(90);
                matrix.postScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_ROTATE_90:
                matrix.setRotate(90);
                break;
            case ExifInterface.ORIENTATION_TRANSVERSE:
                matrix.setRotate(-90);
                matrix.postScale(-1, 1);
                break;
            case ExifInterface.ORIENTATION_ROTATE_270:
                matrix.setRotate(-90);
                break;
        }
       return Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(),
               bitmap.getHeight(), matrix, true);
    }
}
