import {FormEventHandler, useState} from 'react'
import {fetchMetadata} from '../../helpers/fetchMetadata'
import {useBookmarksDispatch} from '../../store'

const NAME_URL = 'url'

export function BookmarkForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useBookmarksDispatch()

  const onSubmit: FormEventHandler = async evt => {
    evt.preventDefault()

    setIsSubmitting(true)

    const form = evt.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const url = `${formData.get(NAME_URL)}`

    try {
      const bookmark = await fetchMetadata(url)
      dispatch({type: 'add', bookmark})
    } catch (err) {
      window.alert(`${err}`)
    } finally {
      form.reset()
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
