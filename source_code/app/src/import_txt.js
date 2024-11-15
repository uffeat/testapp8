let base
if (import.meta.env.DEV) {
  base = '/'
} else {
  base = import.meta.env.BASE_URL
}


//console.dir(import.meta.env)

export async function import_txt(path) {
  const response = await fetch(`${base}${path}`)
  const text = await response.text()
  return text
}