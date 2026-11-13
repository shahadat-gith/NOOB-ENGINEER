// applied to every collection that supports it
export function softDelete(schema) {
    schema.add({
      deletedAt: { type: Date, default: null },
    });
  
    schema.pre(/^find/, function () {
      if (!this.getOptions().withDeleted) {
        this.where({ deletedAt: null });
      }
    });
  
    schema.methods.softDelete = function () {
      this.deletedAt = new Date();
      return this.save();
    };
  
    schema.statics.restoreById = function (id) {
      return this.findOneAndUpdate(
        { _id: id },
        { deletedAt: null },
        { new: true }
      );
    };
  }