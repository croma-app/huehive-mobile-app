package app.croma;

import android.content.Context;
import android.view.OrientationEventListener;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.RotateAnimation;

/** Rotate button based on orientation of device */
public class RotateView extends OrientationEventListener {

  private View view;

  private int preAngle = 90;

  public RotateView(Context context, View view) {
    super(context);

    this.view = view;
  }

  @Override
  public void onOrientationChanged(int i) {
    if (i != OrientationEventListener.ORIENTATION_UNKNOWN) {
      int angle = i;

      if (angle >= (270 - 45) && angle <= (360 - 45) || (angle >= 45 && angle <= (90 + 45))) {
        angle += 180;
      }

      angle %= 360;
      angle = angle >= 180 ? -(360 - angle) : angle;

      if (angle <= 45 && angle >= -45) {
        angle = 0;
      } else if (angle > 45 && angle <= 45 + 90) {
        angle = 90;

        if (preAngle == -180) {
          preAngle = 180;
        }
      } else if (angle > 90 + 45 || (angle >= -180 && angle <= -180 + 45)) {
        if (preAngle == 90) {
          angle = 180;
        } else {
          angle = -180;
        }
      } else {
        angle = -90;

        if (preAngle == 180) {
          preAngle = -180;
        }
      }

      if (Math.abs(preAngle) == Math.abs(angle) && Math.abs(angle) == 180) {
        preAngle = angle;
      }

      if (Math.abs(preAngle - angle) > 45) {
        AnimationSet animSet = new AnimationSet(true);

        animSet.setInterpolator(new DecelerateInterpolator());
        animSet.setFillAfter(true);
        animSet.setFillBefore(true);
        animSet.setFillEnabled(true);

        final RotateAnimation animRotate =
            new RotateAnimation(
                preAngle,
                angle,
                RotateAnimation.RELATIVE_TO_SELF,
                0.5f,
                RotateAnimation.RELATIVE_TO_SELF,
                0.5f);

        animRotate.setDuration(300 * (Math.abs(preAngle - angle)) / 90);
        animRotate.setFillAfter(true);
        animSet.addAnimation(animRotate);

        view.startAnimation(animSet);

        animSet.setAnimationListener(
            new Animation.AnimationListener() {
              @Override
              public void onAnimationStart(Animation animation) {
                RotateView.this.disable();
              }

              @Override
              public void onAnimationEnd(Animation animation) {
                RotateView.this.enable();
              }

              @Override
              public void onAnimationRepeat(Animation animation) {
                // No repeat.
              }
            });

        preAngle = angle;
      }
    }
  }
}
