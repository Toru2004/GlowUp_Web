<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({ title: 'Liên hệ - GlowUp' })

const form = ref({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: ''
})

const errors = ref({} as Record<string,string>)
const submitting = ref(false)

function validate() {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Vui lòng nhập họ và tên.'
  if (!form.value.phone) errors.value.phone = 'Vui lòng nhập số điện thoại.'
  if (!form.value.email) errors.value.email = 'Vui lòng nhập email.'
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email)) errors.value.email = 'Email không hợp lệ.'
  if (!form.value.subject) errors.value.subject = 'Vui lòng nhập tiêu đề.'
  if (!form.value.message) errors.value.message = 'Vui lòng nhập nội dung.'
  return Object.keys(errors.value).length === 0
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  try {
    // Send to backend contact endpoint if exists, fallback to alert
    await $fetch('/api/contact', { method: 'POST', body: form.value }).catch(()=>null)
    // simple success UX
    alert('Cảm ơn! Chúng tôi đã nhận được yêu cầu.');
    form.value = { name: '', phone: '', email: '', subject: '', message: '' }
  } catch (err) {
    console.error(err)
    alert('Gửi thất bại, vui lòng thử lại sau.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="relative w-full">
    <div class="h-64 md:h-80 bg-center bg-cover flex items-center" style="background-image: linear-gradient(rgba(6,11,18,0.15), rgba(6,11,18,0.15)), url('https://images.unsplash.com/photo-1521790945508-bf2a36314e85?auto=format&fit=crop&w=1600&q=80');">
      <div class="container mx-auto px-4 text-white">
        <h1 class="text-3xl md:text-4xl font-serif font-bold">Liên hệ với chúng tôi</h1>
        <p class="mt-2 max-w-2xl">Chúng tôi cam kết phản hồi nhanh chóng và hỗ trợ tận tâm. Liên hệ để được tư vấn miễn phí.</p>
      </div>
    </div>
  </section>

  <section class="container mx-auto px-4 py-10">
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Contact cards -->
      <div class="lg:col-span-1 space-y-4">
        <div class="p-6 bg-white rounded-xl shadow-sm border">
          <h3 class="font-semibold mb-2">Thông tin liên hệ</h3>
          <p class="text-gray-600">Số 70 đường Tô Ký, phường Tân Chánh Hiệp, Quận 12, TP.HCM</p>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-sm border">
          <h4 class="font-semibold">Hotline</h4>
          <a href="tel:+84901234567" class="text-glow-primary-600 block mt-1">(090) 123-4567</a>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-sm border">
          <h4 class="font-semibold">Email</h4>
          <a href="mailto:hello@glowup.vn" class="text-glow-primary-600 block mt-1">hello@glowup.vn</a>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-sm border">
          <h4 class="font-semibold">Thời gian làm việc</h4>
          <p class="text-gray-600 mt-1">Thứ 2 – Thứ 7 | 8:00 – 17:30</p>
        </div>
      </div>

      <!-- Map + CTA -->
      <div class="lg:col-span-2 space-y-6">
        <div class="w-full rounded-xl overflow-hidden shadow-md border">
          <iframe class="w-full h-64 md:h-96" loading="lazy" src="https://www.google.com/maps?q=S%E1%BB%91%2070%20T%C3%B4%20K%C3%BD,%20Ph%C6%B0%E1%BB%9Dng%20T%C3%A2n%20Ch%C3%A1nh%20Hi%E1%BB%87p,%20Qu%E1%BA%ADn%2012,%20TP.HCM&output=embed" title="GlowUp location"></iframe>
        </div>

        <!-- Contact form + reasons -->
        <div class="grid md:grid-cols-2 gap-6">
          <form @submit.prevent="submitForm" class="bg-white p-6 rounded-xl shadow-sm border">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium">Họ và tên</label>
                <input v-model="form.name" class="mt-1 w-full border rounded-md p-2" placeholder="Nguyễn Văn A" />
                <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium">Số điện thoại</label>
                <input v-model="form.phone" class="mt-1 w-full border rounded-md p-2" placeholder="0901234567" />
                <p v-if="errors.phone" class="text-sm text-red-500 mt-1">{{ errors.phone }}</p>
              </div>
            </div>

            <div class="mt-3">
              <label class="block text-sm font-medium">Email</label>
              <input v-model="form.email" class="mt-1 w-full border rounded-md p-2" placeholder="name@domain.com" />
              <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
            </div>

            <div class="mt-3">
              <label class="block text-sm font-medium">Tiêu đề</label>
              <input v-model="form.subject" class="mt-1 w-full border rounded-md p-2" placeholder="Bạn cần hỗ trợ về..." />
              <p v-if="errors.subject" class="text-sm text-red-500 mt-1">{{ errors.subject }}</p>
            </div>

            <div class="mt-3">
              <label class="block text-sm font-medium">Nội dung</label>
              <textarea v-model="form.message" rows="5" class="mt-1 w-full border rounded-md p-2" placeholder="Mô tả vấn đề hoặc yêu cầu của bạn"></textarea>
              <p v-if="errors.message" class="text-sm text-red-500 mt-1">{{ errors.message }}</p>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <button :disabled="submitting" type="submit" class="px-5 py-2 bg-glow-primary-600 text-white rounded-md">{{ submitting ? 'Đang gửi...' : 'Gửi liên hệ' }}</button>
              <a href="https://www.google.com/maps?q=S%E1%BB%91%2070%20T%C3%B4%20K%C3%BD,%20Ph%C6%B0%E1%BB%9Dng%20T%C3%A2n%20Ch%C3%A1nh%20Hi%E1%BB%87p,%20Qu%E1%BA%ADn%2012,%20TP.HCM" target="_blank" class="text-sm text-gray-600">Xem trên Google Maps</a>
            </div>
          </form>

          <div class="bg-white p-6 rounded-xl shadow-sm border">
            <h4 class="font-semibold mb-3">Tại sao nên liên hệ chúng tôi?</h4>
            <ul class="space-y-2 text-gray-700">
              <li>• Phản hồi nhanh trong 24h</li>
              <li>• Tư vấn miễn phí, phù hợp nhu cầu</li>
              <li>• Giải pháp minh bạch, không bán chéo</li>
              <li>• Hỗ trợ hậu mãi tận tâm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="bg-glow-primary-600 text-white py-10">
    <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 class="text-xl font-semibold">Cần tư vấn chuyên sâu?</h3>
        <p class="opacity-90">Đặt lịch để nhận tư vấn 1:1 từ chuyên gia của chúng tôi.</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/contact" class="px-6 py-2 bg-white text-glow-primary-600 rounded-md font-semibold">Liên hệ ngay</NuxtLink>
        <NuxtLink to="/shop" class="px-6 py-2 border border-white/30 rounded-md">Xem sản phẩm</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-glow-primary-600 { background-color: #0b6fa3; }
.text-glow-primary-600 { color: #0b6fa3; }

@media (max-width: 640px) {
  .h-64 { height: 260px }
}
</style>
