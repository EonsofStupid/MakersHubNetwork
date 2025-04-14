def callback(commit):
    # Replace with your actual commit hash (byte string)
    cutoff = b"61c144808190082d4edd73785301b015a6196cc0"

    if commit.original_id == cutoff:
        commit.skip = True
    elif any(parent == cutoff for parent in commit.parents):
        pass  # keep this commit
    else:
        commit.skip = True
