<?php get_header(); ?>

<main class="404">
    <section class="hero">
        <h1>404 - Not Found</h1>
        <p>The page you are looking for does not exist.</p>
    </section>

    <section>
        <div class="container">
            <a href="<?php echo home_url(); ?>">Go back to homepage</a>
        </div>
    </section>
</main>

<?php get_footer(); ?>