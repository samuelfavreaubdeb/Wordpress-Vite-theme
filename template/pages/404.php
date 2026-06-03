<?php get_header(); ?>

<main id="main" class="site-main">
    <section class="hero">
        <h1 class="hero-title">404 - Not Found</h1>
        <p class="hero-description">The page you are looking for does not exist.</p>
    </section>

    <section class="content">
        <div class="container">
            <a href="<?php echo home_url(); ?>">Go back to homepage</a>
        </div>
    </section>
</main>

<?php get_footer(); ?>