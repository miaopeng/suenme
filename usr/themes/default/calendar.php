<?php
/**
 * 日历页面模板
 * 
 * @package custom 
 */
 
 $this->need('header-min.php');
 ?>

    <div class="grid_10" id="content">
	<?php while($this->next()): ?>
        <div class="post get">
			<h2 class="entry_title"><a href="<?php $this->permalink() ?>"><?php $this->title() ?></a></h2>
			<p class="entry_data">
			</p>
			<?php $this->content('阅读剩余部分...'); ?>
        </div>
	<?php endwhile; ?>

    </div><!-- end #content-->

<script>
S.use('familydays',function(S) {

    c = new S.Calendar('#calendar');
    f = S.familydays(c);
    f.init();
    f.update();

    c.on('monthChange',function(e){
		f.update();
	});
    
});
</script>
	<?php $this->need('footer.php'); ?>
