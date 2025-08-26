<?php
/**
 * Plugin Name: Sleep-&-Charge Embed
 * Description: Adds the Sleep-&-Charge Next.js app to the top of your homepage via shortcode or automatic insertion.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

function sac_embed_iframe($atts=[]) {
  $atts = shortcode_atts([
    'src' => 'https://app.travelbucketlist.xyz',
    'height' => '1100'
  ], $atts);
  $html = '<div id="sleep-charge-embed" style="margin:0 auto;max-width:1200px">'
        . '<iframe src="'. esc_url($atts['src']) .'" style="width:100%;height:'.intval($atts['height']).'px;border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
        . '</div>';
  return $html;
}
add_shortcode('sleep_charge', 'sac_embed_iframe');

// Optional: prepend to homepage content
add_filter('the_content', function($content){
  if (is_front_page() && in_the_loop() && is_main_query()) {
    return do_shortcode('[sleep_charge]') . $content;
  }
  return $content;
});