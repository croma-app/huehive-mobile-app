package app.croma;

import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;

public class HelpAnimator implements Animation.AnimationListener {
  private Animation animation;
  private View noColorHelp;

  public HelpAnimator(View noColorHelp) {
    this.noColorHelp = noColorHelp;
  }

  public void cancelGracefully() {
    if (animation != null) {
      animation.setDuration(150);
    }
  }

  @Override
  public void onAnimationStart(Animation animation) {
    noColorHelp.bringToFront();
    this.animation = animation;
    noColorHelp.setOnTouchListener(
        new View.OnTouchListener() {

          @Override
          public boolean onTouch(View view, MotionEvent motionEvent) {
            HelpAnimator.this.cancelGracefully();
            return true;
          }
        });
  }

  @Override
  public void onAnimationEnd(Animation animation) {
    noColorHelp.setOnTouchListener(null);
    // ignore
  }

  @Override
  public void onAnimationRepeat(Animation animation) {
    try {
      Thread.sleep(150);
    } catch (InterruptedException e) {
      // ignore
      e.printStackTrace();
    }
  }
}
