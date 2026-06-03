<?php /* Template Name: Template */ ?>

<?php get_header(); ?>

<main class="template">
    <section class="hero">
        <h1><?php bloginfo('name'); ?></h1>
        <p><?php bloginfo('description'); ?></p>
    </section>

    <section>
        <div class="container">
            <?php
            if ( have_posts() ) :
                while ( have_posts() ) : the_post();?>
                <a href="<?php the_permalink();?>">
                    <div>
                        <h2><?php the_title();?></h2>
                        <?php the_post_thumbnail();?>
                        <?php the_content();?>
                    </div>
                </a>
                <?php endwhile;?>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>
