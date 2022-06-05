import {FormEventHandler, useState} from 'react'
import {useBookmarksDispatch} from '../../store'

const NAME_URL = 'url'

export function BookmarkForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useBookmarksDispatch()

  const onSubmit: FormEventHandler = async evt => {
    evt.preventDefault()

    setIsSubmitting(true)

    try {
      const form = evt.currentTarget as HTMLFormElement
      const formData = new FormData(form)
      const url = `${formData.get(NAME_URL)}`
      const response = await (
        await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
      ).json()
      if (response.error) {
        throw new Error(response.error)
      }
      if (!['photo', 'video'].includes(response.type)) {
        throw new Error('Only video and photo providers are allowed')
      }
      if (!response.width || !response.height || !response.html) {
        throw new Error('No width, height or html returned')
      }

      dispatch({
        type: 'add',
        bookmark: {
          url: response.url,
          provider: response.provider_name,
          title: response.title,
          author: response.author_name,
          type: response.type,
          preview: response.html,
          width: response.width,
          height: response.height,
        },
      })

      form.reset()
    } catch (err) {
      console.error(err)
      window.alert('Sorry, an error occured while fetching the data. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>Add a bookmark</legend>
        <input type="url" required placeholder="Enter the url" name={NAME_URL} />
        <button disabled={isSubmitting}>Add</button>
      </fieldset>
    </form>
  )
}
