package app.croma;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Colors {
    private static Pattern COLOR_PATTERN = Pattern.compile("#[0-9a-fA-F]{6}");
    public static List<String> parse(String text) {
        List<String> colors = new ArrayList<>();
        Matcher matcher = COLOR_PATTERN.matcher(text);
        while (matcher.find()) {
            colors.add(matcher.group());
        }
        return colors;
    }
}
