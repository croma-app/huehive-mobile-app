package app.croma;


import android.content.Context;
import android.content.pm.PackageManager;

import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Utils {

    // Format and encode the string
    public static String getEncodedString(String text) {
        String regex = "((#([0-9a-f]{6}))|(#([0-9a-f]{3})))|(((rgba?)|(cmyk)|(lab))([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?[)]))|((l[\\*]?a[\\*]?b[\\*]?)([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?[-]?[\\s+]?(\\d+)[\\s+]?,[\\s+]?[-]?[\\s+]?(\\d+)[\\s+]?[)]))|(((hsva?)|(hsba?)|(hsla?))([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[%]?[\\s+]?,[\\s+]?(\\d+)[%]?[\\s+]?[)]))";
        Pattern pattern = Pattern.compile(regex);
        StringBuilder sb = new StringBuilder();
        Matcher m = pattern.matcher(text);

        while (m.find()) {
            int si = m.start();
            int ei = m.end();

            sb.append(text.substring(si, ei)).append(" ");
        }

        String query = "";

        try {
            // Ember crashes if there are percentage signs in decoded URL, so let's strip them
            query = URLEncoder.encode(sb.toString().replaceAll("%", ""), "UTF-8")
                    .replaceAll("\\%0A", "%20")
                    .replaceAll("\\+", "%20");

        } catch (Exception e) {
            e.printStackTrace();
        }

        return query;
    }

    // Check if device has a camera
    public static boolean checkCameraHardware(Context context) {
        if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_ANY)){
            return true; // Camera present
        } else {
            return false; // Camera absent
        }
    }

    public static String makePaletteUrl(String query) {
        return "#/palette/show?palette=" + query;
    }



}
