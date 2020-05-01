package app.croma;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class Colors {
    private static String SEPARATOR = "\\s";
    private static Pattern COLOR_PATTERN = Pattern.compile("#[0-9a-fA-F]{6}");
    public static List<String> parse(String text) {
        String words[] = text.split(SEPARATOR);
        System.out.println("Words:" + Arrays.toString(words));
        List<String> colors = new ArrayList<>();
        for (String word : words) {
            if (COLOR_PATTERN.matcher(word).matches()) {
                colors.add(word);
            }
        }
        return colors;
    }
}
