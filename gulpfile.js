var gulp = require('gulp'), //gulp
		sass = require('gulp-sass'), //для компиляции sass в css
		pug = require('gulp-pug'), //для компиляции pug в html
		browserSync = require('browser-sync').create(), //сервер
		autoprefixer = require('gulp-autoprefixer'), //автоматическое добавление префиксов
		cssnano = require('gulp-cssnano'), // минификация css
		concat = require('gulp-concat'), // для конкатенации js
		rename = require('gulp-rename'), // для переименование файла
		uglify = require('gulp-uglify'), // для минификации js
		gulpif = require('gulp-if'), // для посктановки условий
		sourcemaps = require('gulp-sourcemaps'), // для sourcemaps
		plumber = require("gulp-plumber"), // для обработки ошибок
		notify = require("gulp-notify"), // красивые уведомление при ошибке
		clean = require('gulp-clean'), // очистка папки
		spritesmith = require('gulp.spritesmith'),
		svgSprite = require("gulp-svg-sprites"), // создание спрайта
		svgmin = require('gulp-svgmin'), // минификация SVG
		cheerio = require('gulp-cheerio'), // удаление лишних атрибутов из svg
		replace = require('gulp-replace'); // фиксинг некоторых багов

// Компилируем sass в css
gulp.task('sass', function(){
		return gulp.src('app/sass/*.sass')
			.pipe(plumber({
				errorHandler: notify.onError(function(err){
					return {
						title: 'SASS',
						message: err.message
					};
				})
			}))
			// .pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoprefixer({ browsers: ['> 1%'] }))
			// .pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('app/css'))
			.pipe(browserSync.reload({stream: true}));
})

// Компилируем pug в html
gulp.task('pug', function() {
		var YOUR_LOCALS = require('./content.json');

		return gulp.src('app/pug/pages/*.pug')
			.pipe(plumber({
				errorHandler: notify.onError(function(err){
					return {
						title: 'PUG',
						message: err.message
					};
				})
			}))
			// .pipe(sourcemaps.init())
			.pipe(pug({
					pretty: true,
					locals: YOUR_LOCALS
			}))
			// .pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('app'))
			.pipe(browserSync.reload({stream: true}));
});

// Конкатенация js-библиотек
gulp.task('scripts', function() {
		return gulp.src([
						"app/bower_components/jquery.maskedinput/dist/jquery.maskedinput.min.js"
				])
				.pipe(concat('plugins.min.js'))
				.pipe(gulp.dest('app/js'))
});
// Переносим jquery в папку js
gulp.task('jquery', function() {
		return gulp.src('app/bower_components/jquery/dist/jquery.min.js')
				.pipe(rename('jquery.min.js'))
				.pipe(gulp.dest('app/js'))
});

// gulp.task('fontAweson', function(){
// 		gulp.src('app/bower_components/font-awesome/fonts/*')
// 		.pipe(gulp.dest('app/fonts'));
// });

// Сервер
gulp.task('browser-sync', function() {
		browserSync.init({
				server: {
						baseDir: "app"
				}
		});
});

// создание спрайтов из иконок
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/icon/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    cssFormat: 'css',
    imgPath: '../img/sprite.png',
    padding: 30
  }));
  spriteData.img.pipe(gulp.dest('app/img'));
  spriteData.css.pipe(gulp.dest('app/sass/sprite'));
});

gulp.task('svgSpriteBuild', function () {
    return gulp.src('app/img/svg-icons/*.svg')
        // minify svg
				.pipe(svgmin({js2svg: {pretty: true}}))
				//Удаляем атрибуты style, fill и stroke из иконок, для того чтобы они не перебивали стили, заданные через css.
				.pipe(cheerio({
					run: function ($) {
						$('[fill]').removeAttr('fill');
						$('[stroke]').removeAttr('stroke');
						$('[style]').removeAttr('style');
					},
					parserOptions: {xmlMode: true}
				}))
				.pipe(replace('&gt;', '>'))
				.pipe(svgSprite({
					mode: "symbols",
					preview: false,
					selector: "icon-%f",
					svg: {
						symbols: "svg-sprites.html"
					}
				}))
				.pipe(gulp.dest('app/pug/feature'));
});

// Очищаем папку dist
gulp.task('clean', function () {
		return gulp.src('dist', {read: false})
				.pipe(clean());
});

gulp.task('build', ['clean'], function(){

		var buildHtml = gulp.src('app/*.html')
				.pipe(gulp.dest('dist'))

		var buildCss = gulp.src('app/css/*.css')
				// .pipe(cssnano())
				.pipe(gulp.dest('dist/css'));

		var buildJS = gulp.src('app/js/*.js')
				// .pipe(uglify())
				.pipe(gulp.dest('dist/js'))


		var buildImg = gulp.src('app/img/**/*')
				.pipe(gulp.dest('dist/img'));

		var buildFonts = gulp.src('app/fonts/**/*')
				.pipe(gulp.dest('dist/fonts'));


});
//таск слежения за файломи
gulp.task('watch', function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('default', ['sass', 'pug', 'jquery', 'scripts', 'browser-sync', 'watch']);