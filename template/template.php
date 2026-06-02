<?php /* Template Name: Template */ ?>

<?php get_header(); ?>

<main id="main" class="site-main front-page">
    <section class="hero">
        <h1 class="hero-title"><?php bloginfo('name'); ?></h1>
        <p class="hero-description"><?php bloginfo('description'); ?></p>
    </section>

    <section class="content">
        <div class="container">
            <?php
            if ( have_posts() ) :
                while ( have_posts() ) : the_post();?>
                <div class="post">
                    <h2><?php the_title();?></h2>
                    <?php the_post_thumbnail();?>
                    <?php the_content();?>
                </div>
                <?php endwhile;?>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>
