let H2 = {};

// Point
var Point = H2.Point = function (options) {
    this.x = options.x
    this.y = options.y
}

Point.prototype.add = function (point) {
    var x = this.x + point.x
    var y = this.y + point.y
    return new Point({x: x, y: y})
};

Point.prototype.sub = function (point) {
    var x = this.x - point.x
    var y = this.y - point.y
    return new Point({x: x, y: y})
};

Point.prototype.mul = function (scalar) {
    var x = this.x * scalar
    var y = this.y * scalar
    return new Point({x: x, y: y})
}

Point.prototype.div = function (scalar) {
    var x = this.x / scalar
    var y = this.y / scalar
    return new Point({x: x, y: y})
}

Point.prototype.norm = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
}

Point.prototype.normalized = function () {
    var _norm = this.norm()
    if (_norm < 1e-10) {
        return this
    } else {
        return this.div(_norm)
    }
}

Point.prototype.dist = function (point) {
    return this.sub(point).norm()
}

Point.prototype.clone = function () {
    return new Point(this)
}

Point.prototype.equal = function (point) {
    if (this.dist(point) < 1e-10) {
        return true
    } else {
        return false
    }
}


// PoincareDisk
var PoincareDisk = H2.PoincareDisk = function (options) {
    if (options) {
        this._radius = options.radius
        this._center = new Point(options.center)
        this._zoom = options.zoom
    } else {
        this._radius = 1
        this._center = new Point({x: 0, y: 0})
        this._zoom = 1.0
    }
    this._origin = new Point({x: 0, y: 0})
    this._dragStart = null
    this._originStart = null
};

PoincareDisk.prototype.toHyperbolic = function (pointE) {
    var pointH = pointE.sub(this._center).div(this._radius).add(this._origin)
    var normE = pointH.norm()
    if (normE < 1e-10) {
        return new Point({x: 0, y: 0})
    }
    
    pointH = pointH.normalized().mul(Math.tanh(normE / 2 * this._zoom))
    pointH = pointH.mul(this._radius).add(this._center)
    pointH.scale = 1 - Math.tanh(normE / 2 * this._zoom) / 1.7
    return pointH
}

PoincareDisk.prototype.toEuclidean = function (pointH) {
    var pointE = pointH.sub(this._center).div(this._radius).add(this._origin)
    var normH = pointE.norm()
    if (normH < 1e-10) {
        return new Point({x: 0, y: 0})
    }
    pointE = pointE.normalized().mul(Math.atanh(normH) * 2).div(this._zoom)
    return pointE.mul(this._radius).add(this._center)
}

PoincareDisk.prototype.zoom = function (delta) {
    this._zoom += delta
    if (this._zoom < 0) {
        this._zoom = 0
    }
}

PoincareDisk.prototype.setZoom = function (value) {
    this._zoom = value
}

PoincareDisk.prototype.setOrigin = function (value) {
    this._origin = new Point(value)
}

PoincareDisk.prototype.startDrag = function (point) {
    point = new Point(point)
    if (point.sub(this._center).norm() - this._radius < -10) {
        point = point.sub(this._center).div(this._radius)
        var normH = point.norm()
        if (normH < 1e-10) {
            point = new Point({x: 0, y: 0})
        } else {
            point = point.normalized().mul(Math.atanh(normH) * 2).div(this._zoom)
        }

        this._dragStart = point
        this._originStart = this._origin.clone()
    }
}

PoincareDisk.prototype.drag = function (point) {
    point = new Point(point)
    if (point.sub(this._center).norm() - this._radius < -10) {
        if (!this._dragStart) {
            this.startDrag(point)
        }
        point = point.sub(this._center).div(this._radius)
        var normH = point.norm()
        if (normH < 1e-10) {
            point = new Point({x: 0, y: 0})
        } else {
            point = point.normalized().mul(Math.atanh(normH) * 2).div(this._zoom)
        }
        
        this._origin = this._originStart.add(point.sub(this._dragStart))
    }
}

PoincareDisk.prototype.endDrag = function (point) {
    point = new Point(point)
    if (point.sub(this._center).norm() - this._radius < -10) {
        point = point.sub(this._center).div(this._radius)
        var normH = point.norm()
        if (normH < 1e-10) {
            point = new Point({x: 0, y: 0})
        } else {
            point = point.normalized().mul(Math.atanh(normH) * 2).div(this._zoom)
        }

        this._origin = this._originStart.add(point.sub(this._dragStart))
        
        this._dragStart = null
        this._originStart = null
    }
}

export default H2;
// module.exports = H2;