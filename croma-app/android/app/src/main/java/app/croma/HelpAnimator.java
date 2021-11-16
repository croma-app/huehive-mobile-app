package app.croma;

import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;

public class HelpAnimator implements Animation.AnimationListener {
  private Animation animation;
  private View showHelpView;

  public HelpAnimator(View showHelpView) {
    this.showHelpView = showHelpView;
  }

  public void cancelGracefully() {
    if (animation != null) {
      animation.setDuration(150);
    }
  }

  @Override
  public void onAnimationStart(Animation animation) {
    showHelpView.bringToFront();
    this.animation = animation;
    showHelpView.setOnTouchListener(
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
    showHelpView.setOnTouchListener(null);
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
