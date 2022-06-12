// https://gist.github.com/codeguy/6684588
export function slugify(text: string): string {
  return text
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-/, '') // Remove leading -
    .replace(/-$/, '') // Remove trailing -
}

export function uniqSlug<T>(text: string, list: T[], getSlug: (item: T) => string): string {
  const slug = slugify(text)
  const slugRegex = new RegExp(`^${slug}-[1-9][0-9]*$`)
  const highestSlug = Math.max(
    0,
    ...list
      .filter(bk => slugRegex.test(getSlug(bk)))
      .map(bk => {
        return parseInt(getSlug(bk).substring(getSlug(bk).lastIndexOf('-') + 1), 10)
      })
  )
  return `${slug}-${highestSlug + 1}`
}
