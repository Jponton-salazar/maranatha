import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo es requerido'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo válido'],
    },
    contraseña: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No se retorna por defecto
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    verificado: {
      type: Boolean,
      default: false,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para hashear contraseña antes de guardar
userSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña es nueva o fue modificada
  if (!this.isModified('contraseña')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.contraseña = await bcryptjs.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararContraseña = async function (contraseñaIngresada) {
  return await bcryptjs.compare(contraseñaIngresada, this.contraseña);
};

// Middleware para no retornar campos sensibles
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.contraseña;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

export default mongoose.model('User', userSchema);
