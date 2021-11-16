package app.croma;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;
import android.widget.RelativeLayout;

public class DrawTouchDot extends View {
  private int color;
  private int radius;
  private Paint paint;

  private DrawTouchDot(Context c, int color, int radius) {
    super(c);

    paint = new Paint();

    this.color = color;
    this.radius = radius;
  }

  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);

    paint.setAntiAlias(true);
    paint.setColor(Color.rgb(255, 255, 255));

    canvas.drawCircle(radius, radius, radius, paint);

    paint.setColor(color);

    canvas.drawCircle(radius, radius, radius - 4, paint);
    invalidate();
  }

  public static View getColorView(Context ct, int x, int y, int color) {
    int radius = (int) (16 * ct.getResources().getDisplayMetrics().density + 0.5f);
    RelativeLayout.LayoutParams params;
    params = new RelativeLayout.LayoutParams(radius * 2, radius * 2);
    params.leftMargin = x - radius;
    params.topMargin = y - radius;
    RelativeLayout r = new RelativeLayout(ct);
    r.setLayoutParams(params);
    DrawTouchDot dc = new DrawTouchDot(ct, color, radius);
    r.addView(dc);
    r.setOnTouchListener((view, motionEvent) -> false);
    return r;
  }
}
