package app.croma;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ActivityStarterModule extends ReactContextBaseJavaModule {

    public ActivityStarterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CromaModule";
    }

    @ReactMethod
    public void navigateToColorPicker() {
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, ColorPickerActivity.class);
        context.startActivity(intent);
    }
}
