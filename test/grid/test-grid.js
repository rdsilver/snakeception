// Generated by CoffeeScript 1.3.3
(function() {
  'import require';

  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.TestGrid = (function(_super) {

    __extends(TestGrid, _super);

    function TestGrid() {
      return TestGrid.__super__.constructor.apply(this, arguments);
    }

    TestGrid.before = function(start) {
      var _this = this;
      return require(['jquery', 'src/grid', 'src/game2', 'src/pair'], function($, Grid, Game, Pair) {
        var linkHtml;
        _this.Grid = Grid;
        _this.Game = Game;
        _this.Pair = Pair;
        linkHtml = '<link rel="stylesheet" type="text/css" href="../snake.css" />';
        $('head').append(linkHtml);
        $('body').prepend('<div id="game"></div>');
        _this.game = new _this.Game('#game', {
          useDom: true,
          debugStep: true
        });
        return start();
      });
    };

    TestGrid.after = function(start) {
      $('#game').remove();
      $('link').last().remove();
      return start();
    };

    TestGrid.prototype.before = function() {
      this.game = TestGrid.game;
      this.snake = this.game.snake;
      return this.grid = this.game.grid;
    };

    TestGrid.prototype.setupFood = function(coordsArray) {
      var coords, foodPos, _i, _len;
      this.game.restart();
      this.game._gameLoop();
      this.game.foodItems.dequeue();
      for (_i = 0, _len = coordsArray.length; _i < _len; _i++) {
        coords = coordsArray[_i];
        foodPos = new TestGrid.Pair(coords[0], coords[1]);
        this.grid.dropFood(foodPos);
      }
      return this.game._gameLoop();
    };

    TestGrid.prototype.testRestarts = function() {
      this.game.restart();
      this.game._gameLoop();
      this.game.foodItems.dequeue();
      this.grid.dropFood(new TestGrid.Pair(5, 5));
      this.grid.dropFood(new TestGrid.Pair(5, 6));
      this.grid.dropFood(new TestGrid.Pair(5, 6));
      this.game._gameLoop();
      this.game.restart();
      this.game.restart();
      this.game._gameLoop();
      this.game._gameLoop();
      this.game.restart();
      this.game._gameLoop();
      this.game._gameLoop();
      this.game._gameLoop();
      return this.game.restart();
    };

    TestGrid.prototype.testClosestFood = function() {
      var closestFood;
      this.setupFood([[this.grid.squaresX - 1, this.grid.squaresY - 1], [0, 0], [4, 6]]);
      this.game._gameLoop();
      closestFood = this.game.snake.moves.back();
      this.show("Closest food item: " + (closestFood.toString()));
      return this.assert(closestFood.equals(new TestGrid.Pair(4, 6)));
    };

    TestGrid.prototype.testClosestFoodWrap = function() {
      var closestFood;
      this.setupFood([[this.grid.squaresX - 1, this.grid.squaresY - 1], [0, 0], [this.grid.squaresX - 1, 6]]);
      this.game._gameLoop();
      closestFood = this.game.snake.moves.back();
      this.show("Closest food item: " + (closestFood.toString()));
      return this.assert(closestFood.equals(new TestGrid.Pair(this.grid.squaresX - 1, 6)));
    };

    TestGrid.prototype.testModuloBoundaries = function() {
      return console.log('doing test modulo boundaries!');
    };

    return TestGrid;

  })(Test);

}).call(this);
