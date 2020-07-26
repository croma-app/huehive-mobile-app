package app.croma;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;

public class DrawTouchDot extends View {
  private int color;
  private int radius;
  private Paint paint;

  DrawTouchDot(Context c, int color, int radius) {
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
}
