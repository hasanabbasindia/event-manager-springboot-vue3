<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error'
  }
})

const emit = defineEmits(['close'])

function closeStrip() {
  emit('close')
}

// Debug logging
console.log('ValidationStrip created with props:', props)
</script>

<template>
  <!-- Simple version without Teleport first -->
  <div v-if="show" :class="['validation-strip', `strip-${type}`]">
    <div class="strip-content">
      <div class="strip-icon">
        <span v-if="type === 'error'">⚠️</span>
        <span v-else-if="type === 'warning'">❓</span>
        <span v-else-if="type === 'success'">✅</span>
      </div>
      <p class="strip-message">{{ message }}</p>
      <button @click="closeStrip" class="strip-close">
        <span class="close-icon">×</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.validation-strip {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 350px;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: slideInRight 0.3s ease-out;
}

.strip-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.strip-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.strip-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.strip-content {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
}

.strip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.strip-message {
  flex: 1;
  margin: 0;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.4;
}

.strip-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.strip-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.close-icon {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .validation-strip {
    left: 1rem;
    right: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>


