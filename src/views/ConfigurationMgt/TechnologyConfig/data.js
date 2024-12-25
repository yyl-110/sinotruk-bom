let featureOption = [{ value: 'S', label: 'S' }]

for (let i = 1; i <= 40; i++) {
  featureOption.push({ value: 'S' + i, label: 'S' + i })
}
featureOption.unshift({ value: '-', label: '-' })

export { featureOption }
