Array.prototype.at = function(index) {
    if (index >= 0) return this[index];
    return this[(index + this.length)%this.length];
};

// window.log = console.log; /*
window.log = () => {}; // */
