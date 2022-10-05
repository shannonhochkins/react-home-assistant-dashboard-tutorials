### Part 1

Here we authenticate with HA via websockets to recieve updates from HA as devices change state.

### Note

In the video turorial for the configuration.yaml file i highlighted the wake_on_lan config, this isn't necessary, this is all you should need:

```yaml
api:

http:
  cors_allowed_origins: 
    - http://localhost:1234
    - http://yourproductionurl.com
```