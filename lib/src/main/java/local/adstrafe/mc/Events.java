package local.adstrafe.mc;

import org.bukkit.Material;
import org.bukkit.entity.Entity;
import org.bukkit.entity.LivingEntity;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.PlayerInteractEntityEvent;
import org.bukkit.potion.PotionEffectType;
import org.bukkit.potion.PotionEffect;

public class Events implements Listener {
	private final AreYouBlindPlugin plugin;

	public Events(AreYouBlindPlugin plugin) {
		this.plugin = plugin;
		plugin.getServer().getPluginManager().registerEvents(this, plugin);
	}

	@EventHandler
	public void onPlayerInteract(PlayerInteractEntityEvent event) {
		plugin.getLogger().info("Invis yes");

		Player player = event.getPlayer();
		Entity targetEntity = event.getRightClicked();

		if (player.getInventory().getItemInMainHand().getType().equals(Material.STICK) && player.isOp()) {
			if (targetEntity instanceof Player) {
				Player target = (Player)targetEntity;
				player.hidePlayer(plugin, target);
				player.sendMessage("Player " + target.getName() + " made invisible.");
			}
			else if (targetEntity instanceof LivingEntity) {
				LivingEntity target = (LivingEntity)targetEntity;
				target.addPotionEffect(new PotionEffect(PotionEffectType.INVISIBILITY, Integer.MAX_VALUE, 1));
				player.sendMessage("Creature made invisible.");
			}
		}
	}
}
