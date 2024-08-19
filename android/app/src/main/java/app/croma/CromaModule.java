package app.croma;

import static app.croma.FirebaseAnalyticsConstants.TIME_TAKEN_TO_PROCESS_MS;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.google.firebase.remoteconfig.FirebaseRemoteConfig;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class CromaModule extends ReactContextBaseJavaModule implements ActivityEventListener {

  private static final int PICK_COLORS = 1;
  private final ReactApplicationContext reactContext;
  private Promise promise;
  private FirebaseAnalytics mFirebaseAnalytics;
  private FirebaseRemoteConfig firebaseRemoteConfig;

  public CromaModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.reactContext.addActivityEventListener(this);
    mFirebaseAnalytics = FirebaseAnalytics.getInstance(reactContext);
    firebaseRemoteConfig = FirebaseRemoteConfig.getInstance();
    if (BuildConfig.DEBUG) {
      firebaseRemoteConfig.fetch(0); // it's async, Do we need this?
      firebaseRemoteConfig.activate();
    } else {
      firebaseRemoteConfig.fetchAndActivate();
    }
  }

  @Override
  public String getName() {
    return "CromaModule";
  }

  @ReactMethod
  public void getConfigString(String key, Promise promise) {
    // https://console.firebase.google.com/u/0/project/croma-a6256/config/env/firebase
    promise.resolve( firebaseRemoteConfig.getString(key));
  }

  @ReactMethod
  public void getAppInstallTime(Promise promise) {
    try {
      long time =
          reactContext
              .getPackageManager()
              .getPackageInfo(reactContext.getPackageName(), 0)
              .firstInstallTime;

      promise.resolve(time + "");
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
      promise.reject(e);
    }
  }

  @ReactMethod
  public void navigateToColorPicker(Promise promise) {
    this.promise = promise;
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = new Intent(context, ColorPickerActivity.class);
    context.startActivityForResult(intent, PICK_COLORS, new Bundle());
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (data != null && requestCode == PICK_COLORS) {
      try {
        this.promise.resolve(mapToJsonString(data.getIntegerArrayListExtra("colors")));
      } catch (JSONException e) {
        this.promise.reject(e);
      }
    }
  }

  private String mapToJsonString(List<Integer> colors) throws JSONException {
    JSONObject jsonObject = new JSONObject();
    List<JSONObject> colorsObjs = new ArrayList<>();
    for (int color : colors) {
      colorsObjs.add(
          new JSONObject().put("color", String.format("#%06X", (0xFFFFFF & color)).toLowerCase()));
    }

    jsonObject.put("colors", new JSONArray(colorsObjs));
    return jsonObject.toString();
  }

  @Override
  public void onNewIntent(Intent intent) {}

  @ReactMethod
  public void navigateToImageColorPicker(String uri, Promise promise) {
    this.promise = promise;
    ReactApplicationContext context = getReactApplicationContext();
    Intent intent = new Intent(context, ImageColorPickerActivity.class);
    intent.putExtra("uri", uri);
    context.startActivityForResult(intent, PICK_COLORS, new Bundle());
  }

  @ReactMethod
  public void logEvent(String eventId, String data) {
    // https://firebase.google.com/docs/analytics/events?platform=android
    Map<String, Object> bundleMap = parseBundleMap(data);
    Bundle params = new Bundle();
    if (bundleMap == null) {
      putData(params, "data", data);
    } else {
      for (Map.Entry<String, Object> entry : bundleMap.entrySet()) {
        String key = entry.getKey();
        Object value = entry.getValue();
        putData(params, key, value);
      }
    }
    if (BuildConfig.DEBUG) {
      System.out.println(
          "Skipping logging event for debug release. EventId: " + eventId + "," + params);
    } else {
      mFirebaseAnalytics.logEvent(eventId, params);
    }
  }

  private void putData(Bundle bundle, String key, Object data) {
    if (data instanceof Integer) {
      bundle.putInt(key, (Integer) data);
    } else if (data instanceof Long) {
      bundle.putLong(key, (Long) data);
    } else {
      bundle.putString(key, data.toString());
    }
  }

  public Map<String, Object> parseBundleMap(String data) {
    try {
      return Utils.OBJECT_MAPPER.readValue(data, Map.class);
    } catch (JsonProcessingException e) {
      return null;
    }
  }

}
