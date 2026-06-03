<?php get_header(); ?>

<main class="single">
    <div class="wrapper">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post(); ?>
                <article>
                    <h1><?php the_title(); ?></h1>
                    <?php the_post_thumbnail(); ?>
                    <div class="post-content">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        <?php else : ?>
            <p><?php _e('Sorry, no posts matched your criteria.'); ?></p>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>