package app.croma;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class ActivityStarterModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int PICK_COLORS = 1;
    private final ReactApplicationContext reactContext;
    private Callback callback;
    public ActivityStarterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
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

    @Override
    public void onNewIntent(Intent intent) {

    }

}
