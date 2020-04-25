package app.croma;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ActivityStarterModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int PICK_COLORS = 1;
    final ReactApplicationContext reactContext;
    Callback callback;
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
        //ColorPickerActivity colorPickerActivity = (ColorPickerActivity) context.getCurrentActivity();
        context.startActivityForResult(intent, PICK_COLORS, new Bundle());
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        this.callback.invoke(data.getIntegerArrayListExtra("colors").toString());
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

}
