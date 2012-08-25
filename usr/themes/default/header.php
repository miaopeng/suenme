<?php 
Typecho_Widget::widget('Widget_Options')->to($options);
Typecho_Widget::widget('Widget_User')->to($user);

/** 初始化上下文 */
$request = $options->request;
$response = $options->response;

if(!$user->hasLogin()) {
	$response->redirect(Typecho_Common::url('login.php', $options->adminUrl));
}

?>
<!doctype html>
<html>
<head>
<meta charset="<?php $this->options->charset(); ?>" />
<title><?php $this->archiveTitle(' &raquo; ', '', ' - '); ?><?php $this->options->title(); ?></title>

<!-- 使用url函数转换相关路径 -->
<link rel="stylesheet" type="text/css" media="all" href="<?php $this->options->themeUrl('style.css'); ?>?v=110218" />

<!-- 通过自有函数输出HTML头部信息 -->
<?php $this->header(); ?>
<link rel="icon" href="<?php $this->options->siteUrl('favicon.ico'); ?>" type="image/x-icon" />
<link rel="shortcut icon" href="<?php $this->options->siteUrl('favicon.ico'); ?>" type="image/x-icon" />
<?php $this->need('jsbase.php'); ?>
</head>

<body>
<div id="header" class="container_16 clearfix">
	<form id="search" method="post" action="/">
		<div><input type="text" name="s" class="text" size="20" /> <input type="submit" class="submit" value="<?php _e('搜索'); ?>" /></div>
    </form>
	<div id="logo">
	    <h1><a href="<?php $this->options->siteUrl(); ?>">
            <img src="<?php $this->options->themeUrl('/images/logo.gif') ?>" alt="<?php $this->options->title() ?>" />
        </a></h1>
    </div>
</div><!-- end #header -->

<div id="nav_box" class="clearfix">
<ul class="container_16 clearfix" id="nav_menu">
    <li<?php if($this->is('index')): ?> class="current"<?php endif; ?>><a href="<?php $this->options->siteUrl(); ?>"><?php _e('首页'); ?></a></li>
    <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
    <?php while($pages->next()): ?>
    <li<?php if($this->is('page', $pages->slug)): ?> class="current"<?php endif; ?>><a href="<?php $pages->permalink(); ?>" title="<?php $pages->title(); ?>"><?php $pages->title(); ?></a></li>
    <?php endwhile; ?>
</ul>
</div>

<div class="container_16 clearfix">
