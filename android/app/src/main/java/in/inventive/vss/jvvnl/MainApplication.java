package in.inventive.vss.jvvnl;

import android.app.Application;

import com.airbnb.android.react.maps.BuildConfig;
import com.facebook.react.ReactApplication;
import com.gantix.JailMonkey.JailMonkeyPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import org.pgsqlite.SQLitePluginPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;


import com.oblador.vectoricons.VectorIconsPackage;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;


import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
 
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new JailMonkeyPackage(),
            new DocumentPickerPackage(),
            new RNFSPackage(),
            new GeolocationPackage(),
            new SQLitePluginPackage(),
            new RNVersionCheckPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new ImagePickerPackage(),
            new MapsPackage(),
            new RNFusedLocationPackage()
      );
  }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
