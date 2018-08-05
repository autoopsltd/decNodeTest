var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  console.log('Starting scripts task');
  return gulp.src('app/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  console.log('Starting default task');
});

