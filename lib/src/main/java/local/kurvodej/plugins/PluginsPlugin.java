package local.kurvodej.plugins;

import org.bukkit.plugin.java.JavaPlugin;

public final class PluginsPlugin extends JavaPlugin {
    @Override
    public void onEnable() {
        new Events(this);
        getLogger().info("YEET!");
    }
}