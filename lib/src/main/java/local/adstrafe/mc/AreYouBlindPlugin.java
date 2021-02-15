package local.adstrafe.mc;

import org.bukkit.plugin.java.JavaPlugin;

public final class AreYouBlindPlugin extends JavaPlugin {
    @Override
    public void onEnable() {
        new Events(this);
        getLogger().info("YEET!");
    }
}
