#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"TeleMedicine_Mobile";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Paint the root view in the launch-screen colour. It defaults to white, which
// flashed between the purple launch screen and the purple animated splash.
- (void)customizeRootView:(RCTRootView *)rootView
{
  rootView.backgroundColor = [UIColor colorWithRed:0.357 green:0.357 blue:0.965 alpha:1.0];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

// iOS 26+ traps at launch unless the app adopts the UIScene lifecycle. React
// Native 0.76 still builds its window in -application:didFinishLaunchingWithOptions:,
// so this delegate just hands that window to the scene it is connected to.
// Declared here rather than in its own file so the class needs no pbxproj change;
// Info.plist references it by name under UIApplicationSceneManifest.
@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>
@property (nonatomic, strong) UIWindow *window;
@end

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    return;
  }

  UIWindow *window = ((AppDelegate *)UIApplication.sharedApplication.delegate).window;
  if (window == nil) {
    return;
  }

  window.windowScene = (UIWindowScene *)scene;
  self.window = window;
  [window makeKeyAndVisible];
}

@end
