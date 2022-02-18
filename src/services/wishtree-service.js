const apiUrlBase = '/wishtree-api';
export const maxNumberOfFreeLeaves = 100;

export async function deleteDream(wishId) {
  try {
    const res = await fetch(`${apiUrlBase}/wishes/${wishId}`, { method: 'DELETE' });
    if (res.ok) {
      return { error: false };
    }
    return { error: true };
  } catch (err) {
    return { error: true };
  }
}

export async function submitDream(wishId, dreamText, zipCode, author, categoryId) {
  try {
    const body = {
      wishId,
      text: dreamText,
      zipCode,
      author: author || null,
      categoryId,
    };

    const res = await fetch(`${apiUrlBase}/wishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const newWish = await res.json();
      return {
        ...newWish,
        rotateDeg: (Math.random() * 80) - 45,
        isTaken: true,
      };
    }

    if (res.status === 409) {
      return { error: true, leafTaken: true };
    }

    return { error: true };
  } catch (err) {
    return { error: true };
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${apiUrlBase}/categories`);
    if (res.ok) {
      return res.json();
    }
    return { error: true };
  } catch (err) {
    return { error: true };
  }
}

export async function fetchAllWishes(shouldIncludeFreeLeaves) {
  try {
    const wishesResponse = await fetch(`${apiUrlBase}/wishes`);
    if (!wishesResponse.ok) {
      throw wishesResponse.statusText;
    }

    const wishes = await wishesResponse.json();
    let numberOfFreeLeaves = 0;
    const wishesToShow = [];
    wishes.forEach((wish) => {
      if (!wish.text) {
        if (numberOfFreeLeaves < maxNumberOfFreeLeaves && shouldIncludeFreeLeaves) {
          numberOfFreeLeaves++;
        } else {
          return;
        }
      }

      wishesToShow.push({
        ...wish,
        rotateDeg: (Math.random() * 80) - 45,
        isTaken: !!wish.text,
      });
    });

    return wishesToShow;
  } catch (err) {
    return { error: true };
  }
}

export async function fetchTreeStatus() {
  try {
    const res = await fetch(`${apiUrlBase}/tree-status`);
    if (res.ok) {
      return res.json();
    }
    return { error: await res.text(), errorCode: res.status };
  } catch (err) {
    return { error: 'Ukjent feil', errorCode: '-' };
  }
}

export async function updateTreeStatus(isOpen) {
  try {
    const res = await fetch(`${apiUrlBase}/tree-status`, {
      method: 'POST',
      body: JSON.stringify({ isOpen }),
    });
    if (res.ok) {
      return res.json();
    }

    let errorText = await res.text();
    if (res.status === 401) {
      errorText = 'Ikke innlogget';
    }
    return { error: errorText || 'Ukjent feil', errorCode: res.status };
  } catch (err) {
    return { error: 'Ukjent feil', errorCode: '-' };
  }
}
