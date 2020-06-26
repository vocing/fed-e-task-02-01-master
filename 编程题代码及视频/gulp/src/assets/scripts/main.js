// TODO: site logics
console.log(2222)
$(($) => {
  const $body = $('html, body')
  $('#scroll_top').on('click', () => {
    $body.animate({ scrollTop: 0 }, 600)
    return false
  })
})
